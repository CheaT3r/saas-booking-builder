flowchart TD
  Start[Start] --> SignUp[Sign up Page]
  Start[Start] --> SignIn[Sign in Page]
  SignUp --> AuthAPI[Authentication API]
  SignIn --> AuthAPI
  AuthAPI --> Dashboard[Dashboard]
  Dashboard --> BookingBuilder[Booking Builder]
  BookingBuilder --> BookingAPI[Booking API]
  BookingAPI --> Dashboard
  Dashboard --> Logout[Logout]
  Logout --> Start