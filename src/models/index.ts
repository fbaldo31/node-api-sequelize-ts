import * as SequelizeStatic from 'sequelize';
/**
 * Created by Frederick BALDO on 27/06/2017.
 */
export interface ExampleModels {
    User: SequelizeStatic.Model<any, any>;
    Skill: SequelizeStatic.Model<any, any>;
    Project: SequelizeStatic.Model<any, any>;
}
