import { banking_data } from "./creditScoring";
import { create_final_decision } from "./final_decider";

create_final_decision("neetcode", {}, 30000).then(console.log);
create_final_decision("stevencrowder", {}, 150000).then(console.log);