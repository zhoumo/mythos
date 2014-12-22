package mine.mythos.service;

import mine.mythos.model.value.Job;

import org.quartz.CronTrigger;
import org.quartz.JobDataMap;
import org.quartz.JobDetail;
import org.quartz.Scheduler;
import org.quartz.impl.StdScheduler;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class ScheduleService {

	private static Scheduler scheduler;
	static {
		scheduler = (StdScheduler) new ClassPathXmlApplicationContext("spring/applicationContext-scheduled.xml").getBean("schedulerFactory");
	}

	public static boolean enableCronSchedule(Job job, JobDataMap paramsMap, boolean isStateFull) {
		if (job == null) {
			return false;
		}
		try {
			CronTrigger trigger = (CronTrigger) scheduler.getTrigger(job.getTriggerName(), job.getJobGroup());
			if (null == trigger) {
				JobDetail jobDetail = null;
				if (isStateFull) {
					jobDetail = new JobDetail(job.getJobId(), job.getJobGroup(), job.getStateFulljobExecuteClass());
				} else {
					jobDetail = new JobDetail(job.getJobId(), job.getJobGroup(), job.getJobExecuteClass());
				}
				jobDetail.setJobDataMap(paramsMap);
				trigger = new CronTrigger(job.getTriggerName(), job.getJobGroup(), job.getCronExpression());
				scheduler.scheduleJob(jobDetail, trigger);
			} else {
				trigger.setCronExpression(job.getCronExpression());
				scheduler.rescheduleJob(trigger.getName(), trigger.getGroup(), trigger);
			}
		} catch (Exception e) {
			return false;
		}
		return true;
	}
}