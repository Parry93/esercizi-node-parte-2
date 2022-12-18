import "./script-1.mjs";
import "./script-2.mjs";

import { singletonInstance } from "./singleton.mjs";

singletonInstance.output("Mele");
console.log(singletonInstance.array);

//uso l'istanza anche in altri moduli e il risultato viene cachato, perciò quando viene utilizzata, javascript non ne crea una nuova ma usa quella in memoria.
