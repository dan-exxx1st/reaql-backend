import { GraphQLDefinitionsFactory } from '@nestjs/graphql';
import { join } from 'path';

const definitionsFactory = new GraphQLDefinitionsFactory();
definitionsFactory.generate({
    typePaths: ['./src/**/*.graphql'],
    path: join(process.cwd(), '../shared/graphql.ts'),
    outputAs: 'class',
    watch: process.env.IS_WATCH ? true : false,
});
