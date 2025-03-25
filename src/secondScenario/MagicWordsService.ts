import { iFetchData } from "./configs";

export class MagicWordsService {
    private static _instance: MagicWordsService | null = null;
    private _data: iFetchData | null = null;

    private constructor() {}

    static async getInstance(): Promise<MagicWordsService> {
        if (!this._instance) {
            this._instance = new MagicWordsService();
            await this._instance.fetchData();
        }
        return this._instance;
    }

    public getData(): iFetchData | null {
        return this._data;
    }

    async fetchData() {
        if (this._data) return this._data;
        try {
            const response = await fetch('https://private-624120-softgamesassignment.apiary-mock.com/v2/magicwords');
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            this._data = await response.json();
            console.log("Data loaded:", this._data);
            return this._data;
        } catch (error) {
            console.error('Error while fetching', error);
            return null;
        }
    }
}
