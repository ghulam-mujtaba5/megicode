import { fetchPostById } from '../../posts/fetchPostById';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  return fetchPostById(id);
}
