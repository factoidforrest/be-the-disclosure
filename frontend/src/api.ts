import axios from 'axios';

//@ts-ignore
const baseURL = import.meta.env.DEV ? "/api" : ""


const ax = axios.create({
    baseURL
})

export type Torrent = {
    id: number;
    name: string;
    magnetLink: string;
    createdAt: string;
    source: string;
    description: string;
    livePreview: boolean;
    tags: {name:string, id: string}[];
};

export const api = {
    list: async (search:string,tag:string): Promise<Torrent[]> => {
        const res = await ax.get<Torrent[]>('/list', {
            params: {
                search,
                tag
            }
        });
        res.data.forEach((t) => t.livePreview = false);
        return res.data
    }
}