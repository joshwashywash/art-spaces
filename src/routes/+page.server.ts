import type { PageServerLoad } from './$types';
import { Context, Effect, Layer } from 'effect';
import {
	FetchHttpClient,
	HttpClient,
	HttpClientError,
	HttpClientRequest,
	HttpClientResponse,
} from '@effect/platform';
import { ParseResult, Schema } from '@effect/schema';
import { error, redirect } from '@sveltejs/kit';

// TODO: move artworks stuff into a separate file

// which fields should be returned from the api
const Data = Schema.Struct({
	image_id: Schema.String,
	title: Schema.String,
});

const Config = Schema.Struct({
	iiif_url: Schema.String,
});

class Artwork extends Schema.Class<Artwork>('Artwork')({
	data: Data,
	config: Config,
}) {}

class ArtworksService extends Context.Tag('ArtworkService')<
	ArtworksService,
	{
		readonly getById: (
			id: string,
		) => Effect.Effect<
			Artwork,
			ParseResult.ParseError | HttpClientError.HttpClientError
		>;
	}
>() {}

// order does not matter
const fields = Object.keys(Data.fields).join(',');

const makeArtworksService = Effect.gen(function* () {
	const defaultClient = yield* HttpClient.HttpClient;
	const client = defaultClient.pipe((s) =>
		s.pipe(
			HttpClient.filterStatusOk,
			HttpClient.mapRequest((r) =>
				r.pipe(
					HttpClientRequest.prependUrl(
						'https://api.artic.edu/api/v1/artworks/',
					),
					HttpClientRequest.appendUrlParam('field', fields),
				),
			),
		),
	);
	return ArtworksService.of({
		getById: (id) =>
			client
				.get(`/${id}`)
				.pipe(
					Effect.flatMap(HttpClientResponse.schemaBodyJson(Artwork)),
					Effect.scoped,
				),
	});
});

const ArtworksServiceLive = Layer.effect(
	ArtworksService,
	makeArtworksService,
).pipe(Layer.provide(FetchHttpClient.layer));

const DEFAULT_ARTWORK_ID = '129884';

const width = 843;

export const load: PageServerLoad = async (event) => {
	const id = event.url.searchParams.get('id');

	// TODO: don't reuse the event.url
	if (id === null) {
		event.url.searchParams.append('id', DEFAULT_ARTWORK_ID);
		redirect(307, event.url);
	}

	// TODO: is this the best way to do this???
	const result = await Effect.gen(function* () {
		const artworks = yield* ArtworksService;
		return yield* artworks.getById(id);
	}).pipe(
		Effect.map(({ config, data }) => ({
			width,
			url: `${config.iiif_url}/${data.image_id}/full/${width},/0/default.jpg`,
		})),
		Effect.catchTags({
			RequestError: ({ message }) => Effect.succeed({ status: 500, message }),
			ResponseError: ({ response: { status }, message }) =>
				Effect.succeed({ status, message }),
			ParseError: ({ message }) => Effect.succeed({ status: 500, message }),
		}),
		Effect.provide(ArtworksServiceLive),
		Effect.provideService(FetchHttpClient.Fetch, event.fetch),
		Effect.runPromise,
	);

	if ('status' in result) {
		error(result.status, result.message);
	}
	return result;
};
