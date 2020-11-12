import {MigrationInterface, QueryRunner} from "typeorm";

export class PostRefactoring1605120605448 implements MigrationInterface {
    name = 'PostRefactoring1605120605448'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "todo" ("id" character varying NOT NULL, "text" character varying NOT NULL, "done" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_d429b7114371f6a35c5cb4776a7" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "todo"`);
    }

}
