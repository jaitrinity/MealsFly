export class Constant{
    // public static phpServiceURL = "http://www.trinityapplab.in/MealsFly/";
    public static phpServiceURL = "/MealsFly/";
    public static SUCCESSFUL_STATUS_CODE = "200";
    public static MEALSFLY_PRIVATE_KEY = "MEALSFLYPRIVATEKEY";
    public static STORE_KEY =  'lastAction';
    public static CHECK_INTERVAL = 15000; // in ms
    public static MINUTES_UNTIL_AUTO_LOGOUT = 10; // in mins
    public static IMG_WIDTH = 500;
    public static IMG_HEIGHT = 500;
    public static returnServerErrorMessage(serviceName:string):string{
        return "Server error while invoking "+serviceName+ " service";
    }

}