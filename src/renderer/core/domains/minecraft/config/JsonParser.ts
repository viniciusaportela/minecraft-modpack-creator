export class JsonParser {
  constructor() {}

  parse(rawData: any) {
    try {
      return JSON.parse(rawData);
    } catch (err) {
      console.error('[JsonParser.parse]', err);
      return {};
    }
  }
}
