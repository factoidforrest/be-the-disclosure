import {PrismaClient, type Torrent} from './prisma';

const prisma = new PrismaClient();

class TorrentDatabase {
	async getAllTorrents(tag: string, search: string) {
		const query: Parameters<typeof prisma.torrent.findMany>[0] = {
			include: {
				tags: true,
			},
			where: {},
		};

		if (tag) {
			query.where = {
				...query.where,
				tags: {
					some: {
						name: tag,
					},
				},
			};
		}

		if (search) {
			query.where = {
				...query.where,
				OR: [
					{name: {contains: search}},
					{description: {contains: search}},
					// Also search tags because why not
					{
						tags: {
							some: {
								name: {contains: search},
							},
						},
					},
				],
			};
		}

		return prisma.torrent.findMany(query);
	}

	async upsertTorrent(
		torrent: Omit<Torrent, 'id' | 'createdAt'>,
		tagNames: string[],
	): Promise<void> {
		const upsertTags = {
			connectOrCreate: tagNames.map(tName => ({
				where: {
					name: tName,
				},
				create: {
					name: tName,
				},
			})),
		};

		await prisma.torrent.upsert({
			where: {magnetLink: torrent.magnetLink},
			update: {...torrent, tags: upsertTags},
			create: {...torrent, tags: upsertTags},
		});
	}

	async insertTorrent(
		torrent: Omit<Torrent, 'id' | 'createdAt'>,
		tagNames: string[],
	): Promise<void> {
		const upsertTags = {
			connectOrCreate: tagNames.map(tName => ({
				where: {
					name: tName,
				},
				create: {
					name: tName,
				},
			})),
		};

		await prisma.torrent.create({
			data: {...torrent, tags: upsertTags, reviewed: undefined},
		});
	}
}

export const db = new TorrentDatabase();
