package mine.mythos.model.value;

public class Video {

	private String fileName;

	private String filePath;

	private String type;

	private Integer bitRate;

	private String size;

	private String customSize;

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public String getFilePath() {
		return filePath;
	}

	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Integer getBitRate() {
		return bitRate;
	}

	public void setBitRate(Integer bitRate) {
		this.bitRate = bitRate;
	}

	public String getSize() {
		return size;
	}

	public void setSize(String size) {
		this.size = size;
	}

	public String getCustomSize() {
		return customSize;
	}

	public void setCustomSize(String customSize) {
		this.customSize = customSize;
	}
}
