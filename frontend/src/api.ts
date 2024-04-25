import { useAuth0 } from '@auth0/auth0-vue';
import axios, { AxiosRequestConfig } from 'axios';

//@ts-ignore
const baseURL = "/api"

const auth0 = useAuth0();

const ax = axios.create({
    baseURL
});

export interface Torrent {
    id: number;
    name: string;
    magnetLink: string;
    createdAt: string;
    source: string;
    description: string;
    livePreview: boolean;
    tags: {name:string, id: string}[];
};

export interface UploadRes{
    message:string;
    success: boolean;
}

export const api = {
    list: async (search:string,tag:string, token?:string): Promise<Torrent[]> => {
        const body: AxiosRequestConfig<any> = {
            params: {
                search,
                tag
            },
        }
        if (token){
            body.headers = {
                "Authorization":`Bearer ${token}`
            }
        }
        const res = await ax.get<Torrent[]>('/list', body);
        res.data.forEach((t) => t.livePreview = false);
        return res.data
    },
    upload: async (magnetLink:string, token?:string): Promise<UploadRes> => {
        const body: AxiosRequestConfig<any> = {
            params: {
                magnetLink
            },
        }
        if (token){
            body.headers = {
                "Authorization":`Bearer ${token}`
            }
        }
        const res = await ax.post<UploadRes>('/upload', body);
        // res.data.forEach((t) => t.livePreview = false);
        // return res.data
        // TODO: THIS IS MOCHED
        return {success:true, message: "Upload Successful, check back later for approval."}
    }
}