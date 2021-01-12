package maven.java.quickstart;

import java.io.ObjectInputStream.GetField;

/**
 * Hello world!
 *
 */
public class HelloWorld 
{
	private String mystring="Hello World!";
	
    public static void main( String[] args )
    {
       HelloWorld test=new HelloWorld();
       test.printString(test.getString());
    }
    
    
    public void printString(String str) {
    	System.out.println( str );
	}
    
    public String getString() {
    	return mystring;
    }
}