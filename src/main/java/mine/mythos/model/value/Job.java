package mine.mythos.model.value;

public class Job {

	private String jobId;

	private String jobName;

	private String jobGroup;

	private String cronExpression;

	private Class<?> stateFulljobExecuteClass; // 同步的执行类

	private Class<?> jobExecuteClass; // 异步的执行类

	public String getTriggerName() {
		return this.getJobId() + "Trigger";
	}

	public String getJobId() {
		return jobId;
	}

	public void setJobId(String jobId) {
		this.jobId = jobId;
	}

	public String getJobName() {
		return jobName;
	}

	public void setJobName(String jobName) {
		this.jobName = jobName;
	}

	public String getJobGroup() {
		return jobGroup;
	}

	public void setJobGroup(String jobGroup) {
		this.jobGroup = jobGroup;
	}

	public String getCronExpression() {
		return cronExpression;
	}

	public void setCronExpression(String cronExpression) {
		this.cronExpression = cronExpression;
	}

	public Class<?> getStateFulljobExecuteClass() {
		return stateFulljobExecuteClass;
	}

	public void setStateFulljobExecuteClass(Class<?> stateFulljobExecuteClass) {
		this.stateFulljobExecuteClass = stateFulljobExecuteClass;
	}

	public Class<?> getJobExecuteClass() {
		return jobExecuteClass;
	}

	public void setJobExecuteClass(Class<?> jobExecuteClass) {
		this.jobExecuteClass = jobExecuteClass;
	}
}
