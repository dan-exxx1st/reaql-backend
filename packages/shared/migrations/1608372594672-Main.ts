import { generateUserTestData } from 'shared/transactions/users';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class Main1608372594672 implements MigrationInterface {
  name = 'Main1608372594672';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "online" character varying , "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying NOT NULL, "name" character varying NOT NULL, "surname" character varying NOT NULL, "password" character varying NOT NULL, "avatar" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "session" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "token" character varying NOT NULL, "expiresIn" bigint NOT NULL, "userId" uuid, CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "dialog" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "lastMessage" character varying, "lastMessageDate" TIMESTAMP, "group" boolean ,CONSTRAINT "PK_09744e0ee61b1ddf028d8eb8497" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "dialog_props" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userRole" character varying NOT NULL, "unreadMessages" integer NOT NULL, "lastMessageStatus" character varying, "userId" uuid, "dialogId" uuid, CONSTRAINT "PK_92aa62436e714ea2045d0c31e09" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "message" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "text" character varying NOT NULL, "messageDate" TIMESTAMP NOT NULL, "messageStatus" character varying NOT NULL, "dialogId" uuid, "userId" uuid, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "dialog_users_user" ("dialogId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_94f9b779b1bfd854fdb0dddb87f" PRIMARY KEY ("dialogId", "userId"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_7ebf016f2056726eaade448a89" ON "dialog_users_user" ("dialogId") `);
    await queryRunner.query(`CREATE INDEX "IDX_edb53f562f4538bfab43cb3645" ON "dialog_users_user" ("userId") `);
    await queryRunner.query(
      `ALTER TABLE "session" ADD CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "dialog_props" ADD CONSTRAINT "FK_5baad8127c0ca30e95b5e1f24d4" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "dialog_props" ADD CONSTRAINT "FK_b45dda608a682f16409f72de1da" FOREIGN KEY ("dialogId") REFERENCES "dialog"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" ADD CONSTRAINT "FK_272cbdaaa9de52e4d879fa5a501" FOREIGN KEY ("dialogId") REFERENCES "dialog"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" ADD CONSTRAINT "FK_446251f8ceb2132af01b68eb593" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "dialog_users_user" ADD CONSTRAINT "FK_7ebf016f2056726eaade448a895" FOREIGN KEY ("dialogId") REFERENCES "dialog"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "dialog_users_user" ADD CONSTRAINT "FK_edb53f562f4538bfab43cb36453" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    if (process.env.NODE_ENV !== 'production') {
      const users = await generateUserTestData();
      users.forEach(async (user) =>
        queryRunner.query(`insert into "user" (id, email, "name", surname, "password", avatar)  
  values  ('${user.id}', '${user.email}', '${user.name}', '${user.surname}', '${user.password}', '')`),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "dialog_users_user" DROP CONSTRAINT "FK_edb53f562f4538bfab43cb36453"`);
    await queryRunner.query(`ALTER TABLE "dialog_users_user" DROP CONSTRAINT "FK_7ebf016f2056726eaade448a895"`);
    await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_446251f8ceb2132af01b68eb593"`);
    await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_272cbdaaa9de52e4d879fa5a501"`);
    await queryRunner.query(`ALTER TABLE "dialog_props" DROP CONSTRAINT "FK_b45dda608a682f16409f72de1da"`);
    await queryRunner.query(`ALTER TABLE "dialog_props" DROP CONSTRAINT "FK_5baad8127c0ca30e95b5e1f24d4"`);
    await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53"`);
    await queryRunner.query(`DROP INDEX "IDX_edb53f562f4538bfab43cb3645"`);
    await queryRunner.query(`DROP INDEX "IDX_7ebf016f2056726eaade448a89"`);
    await queryRunner.query(`DROP TABLE "dialog_users_user"`);
    await queryRunner.query(`DROP TABLE "message"`);
    await queryRunner.query(`DROP TABLE "dialog_props"`);
    await queryRunner.query(`DROP TABLE "dialog"`);
    await queryRunner.query(`DROP TABLE "session"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
