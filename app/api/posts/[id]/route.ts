import { fetchPostById } from '../fetchPostById';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await Promise.resolve(params);
  return fetchPostById(id);
}
