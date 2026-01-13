export function validateUsername(username: string): string {

  const user = username.toLowerCase()

  if (!user.trim()) return "Username is required";

  if (user.length < 3) return "Username must be at least 3 characters";

  if (user.length > 36) return "Username must be less than 36 characters";

  if (!/^[a-z][a-z0-9_]*$/.test(username)) return "Only letters, numbers, and underscores are allowed";

  return "";
}

export function validateEmail(email: string): string {

  const lEmail = email.toLocaleLowerCase()

  if(!lEmail.trim()) return "Email is required";
  
  if(lEmail.length > 254) return "Email must be less than 254 Characters"
  
  const regex: RegExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  if(!regex.test(lEmail)) {
    return "Enter valid Email. Eg: you@domain.com"
  }

  return "";
}

export function validatePassword(password: string): string {

  if(!password.trim()) return "Password is required";

  if(password.length < 10) return "Password must be atleast 10 characters"

  const regex: RegExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/

  if(!regex.test(password)) {
    return "Password must contain a least one small letter, capital letter, number and special character"
  }

  return ""

}