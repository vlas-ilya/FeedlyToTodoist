import { schedule } from 'node-cron';

type Method = string | symbol;

type Job = {
  cron: string;
  method: Method;
};

const config = {
  cronJobProviders: [],
  jobs: [],
} as {
  starter?: any;
  cronJobProviders: Method[];
  jobs: Job[];
};

export function CronStarter(): ClassDecorator {
  return (target: any) => {
    config.starter = target;
    config.starter.prototype._start = config.starter.prototype._start ?? [];
    config.starter.prototype._start.push(() => startCronJobs());
  };
}

function startCronJobs() {
  config.jobs.forEach((job) => {
    config.cronJobProviders.forEach((provider) => {
      const controller = config.starter.prototype[provider]();
      const context = controller.getContext();
      if (controller[job.method] && controller[job.method]._job) {
        schedule(job.cron, controller[job.method].bind(context));
      }
    });
  });
  console.log("Cron job was started");
}

export function CronJobControllerProvider(): MethodDecorator {
  return function (target: any, propertyKey: string | symbol) {
    config.cronJobProviders.push(propertyKey);
  };
}

export function CronJobController(): ClassDecorator {
  return (target: any) => {
    target.prototype.getContext = function () {
      return this;
    };
  };
}

export function Job(cron: string): MethodDecorator {
  return function (target: any, propertyKey: string | symbol) {
    target[propertyKey]._job = true;
    config.jobs.push({
      cron,
      method: propertyKey,
    });
  };
}
