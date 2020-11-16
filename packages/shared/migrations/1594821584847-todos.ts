import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class todos1594821584847 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'todo',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                    },
                    {
                        name: 'text',
                        type: 'text',
                    },
                    {
                        name: 'done',
                        type: 'boolean',
                    },
                ],
            }),
            true,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('todo');
    }
}
