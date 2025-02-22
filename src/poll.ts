import {GitHub} from '@actions/github/lib/utils'
import {wait} from './wait'

export interface Options {
  client: InstanceType<typeof GitHub>
  log: (message: string) => void

  checkName: string
  timeoutSeconds: number
  intervalSeconds: number
  owner: string
  repo: string
  ref: string
}

export const poll = async (options: Options): Promise<string> => {
  const {
    client,
    log,
    checkName,
    timeoutSeconds,
    intervalSeconds,
    owner,
    repo,
    ref
  } = options

  let now = new Date().getTime()
  const deadline = now + timeoutSeconds * 1000

  while (now <= deadline) {
    log(
      `Retrieving check runs named ${checkName} on ${owner}/${repo}@${ref}...`
    )
    const result = await client.rest.checks.listForRef({
      check_name: checkName,
      owner,
      repo,
      ref
    })

    log(
      `Retrieved ${result.data.check_runs.length} check runs named ${checkName}`
    )

    const allCompletedCheck = result.data.check_runs.every(
      checkRun => checkRun.status === 'completed'
    )
    if (allCompletedCheck) {
      log(`All ${result.data.check_runs.length} runs found are completed`)
      return 'all_completed'
    }

    log(
      `Not all checks named ${checkName} are completed, waiting for ${intervalSeconds} seconds...`
    )
    await wait(intervalSeconds * 1000)

    now = new Date().getTime()
  }

  log(
    `Not all checks are completed after ${timeoutSeconds} seconds, exiting with conclusion 'timed_out'`
  )
  return 'timed_out'
}
