package mine.mythos.util;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Date;

public class UploadUtil {

	public static boolean upload(InputStream inputStream, FileOutputStream outputStream) {
		byte[] buffer = new byte[1024 * 1024];
		int byteread = 0;
		try {
			while ((byteread = inputStream.read(buffer)) != -1) {
				outputStream.write(buffer, 0, byteread);
				outputStream.flush();
			}
			outputStream.close();
			inputStream.close();
		} catch (IOException e) {
			return false;
		}
		return true;
	}

	public static String getUploadRealPath() {
		String path = UploadUtil.class.getResource("").getPath();
		path = path.substring(0, path.indexOf("WEB-INF"));
		path = CommandUtil.formatPath(path) + "file";
		File file = new File(path);
		if (!file.exists()) {
			file.mkdir();
		}
		return path + File.separator;
	}

	public static String getUploadPath() {
		return "/mythos/file/";
	}

	public static String randomFileName(String fileName) {
		Date date = new Date();
		String extension = fileName.substring(fileName.lastIndexOf("."));
		return date.getTime() + extension;
	}

	public static String changeExtension(String fileName, String extension) {
		fileName = fileName.substring(0, fileName.lastIndexOf("."));
		return fileName + "." + extension;
	}
}
