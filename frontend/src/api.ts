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
};

export const api = {
    list: async (): Promise<Torrent[]> => {
        const res = await ax.get<Torrent[]>('/list')
        return res.data
    }
}