package mine.mythos.controller;

import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import mine.mythos.base.BaseController;
import mine.mythos.model.value.Result;
import mine.mythos.model.value.Video;
import mine.mythos.util.CommandUtil;
import mine.mythos.util.UploadUtil;

import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

@Controller
public class VideoConverterController extends BaseController {

	@RequestMapping("/convert.do")
	public void convert(Video video, HttpServletRequest request, HttpServletResponse response) throws IOException {
		response.setContentType("text/html;charset=utf-8");
		MultipartFile file = ((MultipartHttpServletRequest) request).getFile("file");
		video.setFileName(UploadUtil.randomFileName(file.getOriginalFilename()));
		Result result = new Result();
		result.setSuccess(UploadUtil.upload(file.getInputStream(), new FileOutputStream(UploadUtil.getUploadRealPath() + video.getFileName())));
		CommandUtil.execute(buildCommand(video));
		result.setMessage(video);
		returnJson(result, response);
	}

	private List<String> buildCommand(Video video) {
		String commandPath = CommandUtil.getCommandRealPath();
		String uploadPath = UploadUtil.getUploadRealPath();
		String fileName = video.getFileName();
		String newFileName = "_" + UploadUtil.changeExtension(fileName, video.getType());
		String filePath = uploadPath + newFileName;
		String extension = CommandUtil.isWindows() ? ".exe" : "";
		List<String> command = new ArrayList<String>();
		command.add(commandPath + "ffmpeg" + extension);
		command.add("-y");
		command.add("-i");
		command.add(uploadPath + fileName);
		command.add("-vcodec");
		command.add("libx264");
		command.add("-b");
		command.add(video.getBitRate() + "k");
		command.add("-r");
		command.add("25");
		command.add("-s");
		command.add(StringUtils.isEmpty(video.getCustomSize()) ? video.getSize() : video.getCustomSize());
		command.add("-ar");
		command.add("22050");
		command.add(filePath);
		video.setFilePath(UploadUtil.getUploadPath() + newFileName);
		return command;
	}
}
