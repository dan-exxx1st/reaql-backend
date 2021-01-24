import { CreateMockFactory } from '.';
import { MessagesMock } from '../data/messages';

export const MessageMockFactory = CreateMockFactory({
  createQueryBuilder() {
    this.data = MessagesMock;

    this.where = () => {
      return this;
    };

    this.leftJoinAndSelect = () => {
      return this;
    };

    this.getMany = () => {
      return this.data;
    };

    this.getOne = () => {
      return this.data;
    };

    this.orderBy = () => this;

    return this;
  },
});
