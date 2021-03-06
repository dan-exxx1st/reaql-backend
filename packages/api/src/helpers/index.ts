import { GraphQLResolveInfo } from 'graphql';

export function getQueryFields(info: GraphQLResolveInfo) {
  const fieldNames: string[] = info.fieldNodes[0].selectionSet.selections
    .map((selection) => (selection as any).name.value)
    .filter((fieldName: string) => fieldName !== '__typename');

  return fieldNames;
}
