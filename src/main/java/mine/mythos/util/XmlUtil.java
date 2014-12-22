package mine.mythos.util;

import java.io.File;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;

public class XmlUtil {

	@SuppressWarnings({ "unchecked" })
	public static <T> T xmlToObject(String xmlPath, Class<T> clazz) {
		Object instance = null;
		try {
			JAXBContext jaxbContext = JAXBContext.newInstance(clazz);
			Unmarshaller jaxbUnmarshaller = jaxbContext.createUnmarshaller();
			instance = clazz.newInstance();
			instance = (T) jaxbUnmarshaller.unmarshal(new File(xmlPath));
		} catch (JAXBException e) {
			e.printStackTrace();
		} catch (InstantiationException e) {
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		}
		return (T) instance;
	}
}
