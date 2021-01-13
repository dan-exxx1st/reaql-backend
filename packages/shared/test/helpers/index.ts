export function CreateMockFactory(functions: unknown) {
  return jest.fn(() => functions);
}
