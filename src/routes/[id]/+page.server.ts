import type { PageServerLoad } from './$types';
import type { UnionToTuple } from 'type-fest';

// which fields should be returned from the api
type Data = {
	image_id: string;
	title: string;
};

type Config = {
	iiif_url: string;
};

type Artwork = {
	data: Data;
	config: Config;
};

type Field = keyof Data;

// order does not matter here since these will be joined
// the api does not care whether it's fields=image_id,title or fields=title,image_id
const fields: UnionToTuple<Field> = ['image_id', 'title'];

// api recommends this width
const width = 843;

const baseUrl = new URL('https://api.artic.edu/api/v1/artworks/');
baseUrl.searchParams.append('fields', fields.join(','));

export const load: PageServerLoad = async (event) => {
	const url = new URL(event.params.id, baseUrl);

	const artwork: Artwork = await event
		.fetch(url)
		.then((response) => response.json());

	return {
		width,
		url: `${artwork.config.iiif_url}/${artwork.data.image_id}/full/${width},/0/default.jpg`,
	};
};
