import { genSaltSync, hash } from 'bcryptjs';
import { v4 } from 'uuid';

export async function generateUserTestData() {
  const lenght = 3;

  const UsersData = [];
  const salt = genSaltSync(10);

  for (let i = 0; i < lenght - 1; i++) {
    const iPlus = i + 1;
    const hashedPass = await hash(`pass${iPlus}`, salt);
    const user = {
      id: v4(),
      email: `testuser${iPlus}@ya.ru`,
      name: `Test ${iPlus}`,
      surname: `User ${iPlus}`,
      password: hashedPass,
      avatar: '',
    };
    UsersData.push(user);
  }

  const defaultUserHashPass = await hash('123', salt);

  const defaultUser = {
    id: v4(),
    email: '123@ya.ru',
    name: 'Dan',
    surname: 'Parfenov',
    password: defaultUserHashPass,
    avatar: '',
  };

  UsersData.push(defaultUser);

  return UsersData;
}
