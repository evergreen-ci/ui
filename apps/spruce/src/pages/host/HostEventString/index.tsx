import { Code } from "@leafygreen-ui/code";
import Accordion, {
  AccordionCaretIcon,
} from "@evg-ui/lib/components/Accordion";
import { toSentenceCase } from "@evg-ui/lib/utils/string";
import { ShortenedRouterLink } from "components/styles";
import { getTaskRoute } from "constants/routes";
import { HostEventLogData, HostEventType } from "gql/generated/types";

interface TaskLinkProps {
  "data-cy": string;
  taskId: string;
}
const TaskLink: React.FC<TaskLinkProps> = ({ "data-cy": dataCy, taskId }) => (
  <ShortenedRouterLink
    data-cy={dataCy}
    responsiveBreakpoint={1200}
    title={taskId}
    to={getTaskRoute(taskId)}
  >
    {taskId}
  </ShortenedRouterLink>
);

interface HostEventStringProps {
  eventType: string;
  data: HostEventLogData;
}
const HostEventString: React.FC<HostEventStringProps> = ({
  data,
  eventType,
}) => {
  const succeededString = "succeeded";
  const failedString = "failed";

  switch (eventType) {
    case HostEventType.HostCreated:
      return (
        <div data-cy="created">
          Host creation {data.successful ? succeededString : failedString}
          {data.logs && (
            <HostEventLog isCode logs={data.logs} title="Additional details" />
          )}
        </div>
      );
    case HostEventType.HostAgentDeployFailed:
      return <span data-cy="agent-deploy-failed">New agent deploy failed</span>;
    case HostEventType.HostProvisionError:
      return (
        <span data-cy="provision-error">
          Host encountered error during provisioning
        </span>
      );
    case HostEventType.HostStarted:
      return (
        <div data-cy="started">
          Host start attempt {data.successful ? succeededString : failedString}
          {data.logs && (
            <HostEventLog isCode logs={data.logs} title="Additional details" />
          )}
        </div>
      );
    case HostEventType.HostStopped:
      return (
        <div data-cy="stopped">
          Host stop attempt {data.successful ? succeededString : failedString}
          {data.logs && (
            <HostEventLog isCode logs={data.logs} title="Additional details" />
          )}
        </div>
      );
    case HostEventType.HostRebooted:
      return (
        <div data-cy="rebooted">
          {data.successful
            ? "Successfully triggered host reboot"
            : "Failed to trigger host reboot"}
          {data.logs && (
            <HostEventLog isCode logs={data.logs} title="Additional details" />
          )}
        </div>
      );
    case HostEventType.HostModified:
      return (
        <div data-cy="modified">
          Host modify attempt {data.successful ? succeededString : failedString}
          {data.logs && (
            <HostEventLog isCode logs={data.logs} title="Additional details" />
          )}
        </div>
      );
    case HostEventType.HostAgentDeployed:
      return (
        <div data-cy="agent-deployed">
          Agent deployed {data.agentRevision ? "with revision" : ""}{" "}
          <b>{data.agentRevision}</b> {data.agentBuild ? " from " : ""}
          <b>{data.agentBuild}</b>
        </div>
      );
    case HostEventType.HostAgentMonitorDeployed:
      return (
        <div data-cy="agent-monitor-deployed">
          Agent monitor deployed {data.agentRevision ? "with revision" : ""}{" "}
          <b>{data.agentRevision}</b>
        </div>
      );
    case HostEventType.HostAgentMonitorDeployFailed:
      return (
        <span data-cy="agent-monitor-deploy-failed">
          New agent monitor deploy failed
        </span>
      );
    case HostEventType.HostJasperRestarting:
      return (
        <div data-cy="host-jasper-restarting">
          Jasper service marked as restarting {data.user ? "by" : ""}{" "}
          <b>{data.user}</b>
        </div>
      );
    case HostEventType.HostJasperRestarted:
      return (
        <div data-cy="host-jasper-restarted">
          Jasper service restarted with revision <b>{data.jasperRevision}</b>
        </div>
      );
    case HostEventType.HostJasperRestartError:
      return (
        <div data-cy="host-jasper-restart-error">
          Host encountered error when restarting Jasper service
          {data.logs && (
            <HostEventLog isCode logs={data.logs} title="Provisioning logs" />
          )}
        </div>
      );
    case HostEventType.HostConvertingProvisioning:
      return (
        <span data-cy="host-converting-provisioning">
          Host converting provisioning type
          {data.provisioningMethod ? " to" : ""} {data.provisioningMethod}
          {data.provisioningMethod ? " method" : ""}
        </span>
      );
    case HostEventType.HostConvertedProvisioning:
      return (
        <span data-cy="host-converted-provisioning">
          Host successfully converted provisioning type
          {data.provisioningMethod ? " to" : ""} {data.provisioningMethod}
          {data.provisioningMethod ? " method" : ""}
        </span>
      );
    case HostEventType.HostConvertingProvisioningError:
      return (
        <div data-cy="host-converting-provisioning-error">
          Host encountered error when converting reprovisioning
          {data.logs && (
            <HostEventLog isCode logs={data.logs} title="Provisioning logs" />
          )}
        </div>
      );
    case HostEventType.HostStatusChanged:
      return (
        <div data-cy="host-status-changed">
          Status changed from <b>{data.oldStatus}</b> to <b>{data.newStatus}</b>{" "}
          {data.user ? "by" : ""} <b>{data.user}</b>{" "}
          {data.logs && (
            <HostEventLog
              isCode={false}
              logs={data.logs}
              title="Additional details"
            />
          )}
        </div>
      );
    case HostEventType.HostDnsNameSet:
      return (
        <div data-cy="host-dns-name-set">
          DNS Name set to <b>{data.hostname}</b>
        </div>
      );
    case HostEventType.HostScriptExecuted:
      return (
        <div data-cy="host-script-executed">
          Executed script on host
          {data.logs && (
            <HostEventLog isCode logs={data.logs} title="Script logs" />
          )}
        </div>
      );
    case HostEventType.HostScriptExecuteFailed:
      return (
        <div data-cy="host-script-execute-failed">
          Failed to execute script on host
          {data.logs && (
            <HostEventLog isCode logs={data.logs} title="Script logs" />
          )}
        </div>
      );
    case HostEventType.HostProvisioned:
      return (
        <div data-cy="host-provisioned">
          Marked as <b>provisioned</b>
        </div>
      );
    case HostEventType.HostRunningTaskSet:
      return (
        <div data-cy="host-running-task-set">
          Assigned to run task{" "}
          <TaskLink data-cy="host-running-task-set-link" taskId={data.taskId} />
        </div>
      );
    case HostEventType.HostRunningTaskCleared:
      return (
        <div data-cy="host-running-task-cleared">
          Current running task cleared (was:{" "}
          <TaskLink
            data-cy="host-running-task-cleared-link"
            taskId={data.taskId}
          />
        </div>
      );
    case HostEventType.HostProvisionFailed:
      return (
        <div data-cy="host-provision-failed">
          Provisioning failed{" "}
          {data.logs && (
            <HostEventLog isCode logs={data.logs} title="Provisioning logs" />
          )}
        </div>
      );
    case HostEventType.HostTaskFinished:
      return (
        <div data-cy="host-task-finished">
          Task{" "}
          <TaskLink data-cy="host-task-finished-link" taskId={data.taskId} />{" "}
          completed with status:
          <b> {data.taskStatus}</b>
        </div>
      );
    case HostEventType.HostExpirationWarningSent:
      return (
        <span data-cy="host-expiration-warning-set">
          Expiration warning sent
        </span>
      );
    case HostEventType.HostTemporaryExemptionExpirationWarningSent:
      return <span>Temporary exemption expiration warning sent</span>;
    case HostEventType.VolumeMigrationFailed:
      return (
        <span data-cy="host-volume-migration-failed">
          Home volume failed to migrate to new host.
          {data.logs && (
            <HostEventLog
              isCode
              logs={data.logs}
              title="Volume migration logs"
            />
          )}
        </span>
      );
    case HostEventType.HostCreatedError:
      return (
        <span data-cy="host-creation-failed">
          Host creation failed.
          {data.logs && (
            <HostEventLog isCode logs={data.logs} title="Host creation logs" />
          )}
        </span>
      );
    case HostEventType.HostIdleNotification:
      return (
        <span data-cy="host-idle-notification">Idle notification sent</span>
      );
    case HostEventType.HostTerminatedExternally:
      return (
        <span data-cy="host-terminated-externally">
          Host terminated externally by {data.user}
        </span>
      );
    case HostEventType.VolumeExpirationWarningSent:
      return (
        <span data-cy="volume-expiration-warning-sent">
          Volume expiration warning sent
        </span>
      );
    case HostEventType.SpawnHostCreatedError:
      return (
        <span data-cy="spawn-host-creation-failed">
          Spawn host creation failed.
          {data.logs && (
            <HostEventLog isCode logs={data.logs} title="Host creation logs" />
          )}
        </span>
      );
    default:
      return <span>{eventType}</span>;
  }
};

export const HostEventLog: React.FC<{
  title: string;
  logs: string;
  isCode: boolean;
}> = ({ isCode, logs, title }) => (
  <Accordion
    caretIcon={AccordionCaretIcon.Caret}
    data-cy="host-event-log"
    title={title}
  >
    <span data-cy="host-event-log-content">
      {isCode ? <Code language="shell">{logs}</Code> : logs}
    </span>
  </Accordion>
);

/**
 * `formatHostFilterOption` formats a HostEventType enum to a string that is shown as
 * a filter option in the dropdown.
 * @param e - HostEventType to format
 * @returns a string that satisfies the following:
 * - HOST prefix is removed
 * - underscores are replaced with spaces
 * - adheres to sentence case
 */
export const formatHostFilterOption = (e: HostEventType): string => {
  const option = e
    .toString()
    .replace(/HOST/, "")
    .replace(/_/g, " ")
    .trimStart();
  return toSentenceCase(option).replace(/dns/i, "DNS");
};

export default HostEventString;
