import { Injectable } from '@nestjs/common';
import { readFile, writeFile } from 'fs/promises';

type DataType = {
  [key: string]: {
    content: string;
    id: number;
  };
};

@Injectable()
export class MessagesRepository {
  async findOne(id: string) {
    const contents = await readFile('messages.json', 'utf8');
    const messages = JSON.parse(contents) as DataType;
    return messages[id];
  }

  async findAll() {
    const contents = await readFile('messages.json', 'utf8');
    const messages = JSON.parse(contents) as DataType;

    return messages;
  }

  async create(content: string) {
    const contents = await readFile('messages.json', 'utf8');
    const messages = JSON.parse(contents) as DataType;

    const id = Math.floor(Math.random() * 999);

    messages[id] = { id, content };

    await writeFile('messages.json', JSON.stringify(messages));

    return messages[id];
  }
}
