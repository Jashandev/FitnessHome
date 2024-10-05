import { combineReducers } from 'redux';
import AuthSlice from './AuthSlice';
import plansSlice from './PlansSlice';
import TrainersSlice from './TrainersSlice';
import AttendanceSlice from './AttendanceSlice';
import ExpensesSlice from './ExpensesSlice';
import AssignPlan from './AssignPlan';
import UpgradePlan from './UpgradePlan';
import GenerateInvoice from './GenerateInvoice';
import UserSlice from './UserSlice';
import ManagerSlice from './ManagerSlice';
import InvoicesSlice from './InvoicesSlice';
import AssignTrainer from './AssignTrainer';
import financeSlice from './financeSlice';
import usersSlice from './usersSlice';


const rootReducer = combineReducers({
  Auth: AuthSlice,
  Plans: plansSlice,
  Attendance: AttendanceSlice,
  Expenses: ExpensesSlice,
  AssignPlan: AssignPlan,
  UpgradePlan: UpgradePlan,
  GenerateInvoice: GenerateInvoice,
  User: UserSlice,
  Trainers: TrainersSlice,
  Managers: ManagerSlice,
  Invoices: InvoicesSlice,
  AssignTrainer: AssignTrainer,
  Finance: financeSlice,
  Users: usersSlice,
});

export default rootReducer;
