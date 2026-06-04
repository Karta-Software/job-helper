export async function loadJsonGraph<T>(readFile: (path: string) => Promise<string>, path: string): Promise<T> {
  return JSON.parse(await readFile(path)) as T;
}
