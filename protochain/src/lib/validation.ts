//Validation class
export default class Validation {
  sucess: boolean;
  message: string;

  /*Creates a new validation object
  @param sucess If the validation was the succesfull
  @param message The validation message, if validation failed
   */
  constructor(sucess: boolean = true, message: string = ''){
    this.sucess = sucess;
    this.message = message;
  }
}