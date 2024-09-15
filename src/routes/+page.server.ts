import { error, redirect } from '@sveltejs/kit';
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

type NotFound = {
	status: 404;
	error: 'Not Found';
	detail: 'The item you requested cannot be found.';
};

type Field = keyof Data;

// api recommends this width
const width = 843;

const baseUrl = new URL('https://api.artic.edu/api/v1/artworks/');
// the api does not care whether it's fields=image_id,title or fields=title,image_id
const fieldsTuple: UnionToTuple<Field> = ['image_id', 'title'];
const fields = fieldsTuple.join(',');

const DEFAULT_ARTWORK_ID = '129884';

export const load: PageServerLoad = async (event) => {
	const id = event.url.searchParams.get('id');
	if (id === null) {
		event.url.searchParams.append('id', DEFAULT_ARTWORK_ID);
		redirect(307, event.url);
	}

	const url = new URL(id, baseUrl);
	url.searchParams.append('fields', fields);

	const response = await event.fetch(url);
	if (response.ok) {
		const artwork: Promise<Artwork> = response.json();
		return {
			artwork,
			width,
		};
	}
	error(response.status, response.statusText);
};
