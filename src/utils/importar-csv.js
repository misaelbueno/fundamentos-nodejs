import assert from 'node:assert';
import { generate } from 'csv-generate';
import { parse } from 'csv-parse';
import fs from 'node:fs';

const csvPath = new URL('../../tasks.csv', import.meta.url)

const stream = fs.createReadStream(csvPath)

const csvParse = parse({
  delimiter: ',',
  skipEmptyLines: true,
  fromLine: 2 // pular primeira linha
})

async function readFileCsv() {
  const parseLines = stream.pipe(csvParse)

  for await (const line of parseLines) {
    const [title, description] = line;

    fetch('http://localhost:3333/tasks', {
      method: 'POST',
      body: JSON.stringify({
        title,
        description
      }),
      duplex: 'half'
    })
  }
}


readFileCsv()
