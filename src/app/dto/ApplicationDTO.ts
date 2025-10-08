import { ApplicationType } from "../enums/ApplicationType"
import { DeploymentType } from "../enums/DeploymentType"
import { LifecyclePhase } from "../enums/LifecyclePhase"
import { ProgrammingLanguage } from "../enums/ProgrammingLanguage"


export interface ApplicationDTO {
  applicationId: string
  name: string
  type: ApplicationType | null
  lifecyclePhase: LifecyclePhase | null
  systemSize: number | null
  language: ProgrammingLanguage | null
  deploymentType: DeploymentType | null
}