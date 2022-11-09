import dotenv from 'dotenv';
import { Application } from './application/Application';

dotenv.config();

new Application();

//import { weekScheduleSpec } from './infrastructure/services/utils/WeekSchedule.spec';
//weekScheduleSpec().then();
