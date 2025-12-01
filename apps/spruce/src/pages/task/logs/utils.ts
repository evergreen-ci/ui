export interface ValidatedTaskLogParams {
  taskId: string;
  execution: number;
  origin: string;
}

export const validateTaskLogParams = (
  taskId: string | undefined,
  execution: string | null,
  origin: string | null,
): ValidatedTaskLogParams => {
  if (!taskId) {
    throw new Error("Task ID not specified");
  }

  const executionNum = parseInt(execution || "", 10);
  if (isNaN(executionNum)) {
    throw new Error("Execution not specified");
  }

  if (!origin) {
    throw new Error("Log origin type not specified");
  }

  return {
    taskId,
    execution: executionNum,
    origin,
  };
};

export interface ValidatedTestLogParams {
  taskId: string;
  execution: number;
  testName: string;
}

export const validateTestLogParams = (
  taskId: string | undefined,
  execution: string | null,
  testName: string | null,
): ValidatedTestLogParams => {
  if (!taskId) {
    throw new Error("Task ID not specified");
  }

  const executionNum = parseInt(execution || "", 10);
  if (isNaN(executionNum)) {
    throw new Error("Execution not specified");
  }

  if (!testName) {
    throw new Error("Test name not specified");
  }

  return {
    taskId,
    execution: executionNum,
    testName,
  };
};
