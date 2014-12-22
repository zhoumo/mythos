package mine.mythos.util;

import java.io.File;
import java.io.InputStream;
import java.util.List;
import java.util.Properties;

public class CommandUtil {

	public static void execute(List<String> command) {
		Process process = null;
		try {
			process = new ProcessBuilder(command).start();
			new PrintStream(process.getInputStream()).start();
			new PrintStream(process.getErrorStream()).start();
			process.waitFor();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public static String getCommandRealPath() {
		String path = CommandUtil.class.getResource("").getPath();
		path = path.substring(0, path.indexOf("WEB-INF"));
		path = formatPath(path);
		return path + "COMMAND" + File.separator;
	}

	public static String formatPath(String path) {
		if (isWindows()) {
			if (path.startsWith("/")) {
				path = path.substring(1);
			}
			return path.replace("/", "\\");
		}
		return path;
	}

	public static boolean isWindows() {
		Properties prop = System.getProperties();
		String osName = prop.getProperty("os.name");
		return osName.toLowerCase().startsWith("windows");
	}

	public static class PrintStream extends Thread {

		InputStream stream = null;

		public PrintStream(InputStream stream) {
			this.stream = stream;
		}

		public void run() {
			try {
				while (this != null) {
					int ch = this.stream.read();
					if (ch == -1) {
						break;
					}
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}
}
