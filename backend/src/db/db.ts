import sqlite3 from 'sqlite3';
import { open, type Database } from 'sqlite';

export interface TorrentRecord {
  id?: number
  name: string
  magnetLink: string
  createdAt?: Date
  source: string
  description: string
}

class TorrentDatabase {
  // @ts-expect-error
  private db: Database;

  constructor () {
    this.connect();
  }

  async connect (): Promise<void> {
    this.db = await open({
      filename: './mydb.sqlite',
      driver: sqlite3.Database
    });

    await this.migrate();
  }

  async migrate (): Promise<void> {
    const migration = `
        CREATE TABLE IF NOT EXISTS torrents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            magnetLink TEXT NOT NULL UNIQUE,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            source TEXT NOT NULL,
            description TEXT NOT NULL
        );`;

    await this.db.run(migration);
  }

  async getAllVideos (): Promise<TorrentRecord[]> {
    return await this.db.all<TorrentRecord[]>('SELECT * FROM torrents');
  }

  // async addVideo(video: Omit<TorrentRecord, 'id' | 'createdAt'>): Promise<void> {
  //     const { name, magnetLink, source } = video;
  //     await this.db.run(
  //         'INSERT INTO torrents (name, magnetLink, source) VALUES (?, ?, ?)',
  //         [name, magnetLink, source]
  //     );
  // }

  async upsertVideo (video: Omit<TorrentRecord, 'id' | 'createdAt'>): Promise<void> {
    console.log('db upsert called');
    console.log(db.db);
    await new Promise((resolve, reject) => {
      const query = 'INSERT OR IGNORE INTO torrents (name, magnetLink, source, description) VALUES (?, ?, ?, ?)';
      this.db.run(query, [video.name, video.magnetLink, video.source, video.description], (err: unknown) => {
        if (err) {
          console.error('db upsert error', err);
          reject(err);
        } else {
          console.log('upsert success');
          resolve();
        }
      });
    });
  }
}

export const db = new TorrentDatabase();
