<p align="center">
  <a href="https://github.com/apptio-msobala/action-wait-until-check-complete/actions"><img alt="action-wait-until-check-complete status" src="https://github.com/apptio-msobala/action-wait-until-check-complete/workflows/build-test/badge.svg"></a>
</p>

# GitHub Action: Wait for all Checks completion

A GitHub Action that allows you to wait for another GitHub check until all are completed. This is useful if you want to run one Workflow only if another is not running.

## Example Usage

```yaml
    steps:
      - name: Wait for all builds to complete
        uses: apptio-msobala/action-wait-until-check-complete@v1.1.1
        id: wait-for-build
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          checkName: build
          ref: ${{ github.event.pull_request.head.sha || github.sha }}

```
## Inputs

This Action accepts the following configuration parameters via `with:`

- `token`

  **Required**
  
  The GitHub token to use for making API requests. Typically, this would be set to `${{ secrets.GITHUB_TOKEN }}`.
  
- `checkName`

  **Required**
  
  The name of the GitHub check to wait for. For example, `build` or `deploy`.

  **IMPORTANT**: If the check you're referencing is provided by another GitHub Actions workflow, make sure that you reference the name of a _Job_ within that workflow, and _not_ the name the _Workflow_ itself.

- `ref`

  **Default: `github.sha`**
  
  The Git ref of the commit you want to poll for a passing check.

  _PROTIP: You may want to use `github.event.pull_request.head.sha` when working with Pull Requests._

  *PROTIP2: You may want to use `refs/heads/{branch}` if you want to observe a particular branch.*
  
- `repo`

  **Default: `github.repo.repo`**
  
  The name of the Repository you want to poll for a passing check.

- `owner`

  **Default: `github.repo.owner`**
  
  The name of the Repository's owner you want to poll for a passing check.

- `timeoutSeconds`

  **Default: `600`**

  The number of seconds to wait for the check to complete. If the check does not complete within this amount of time, this Action will emit a `conclusion` value of `timed_out`.
  
- `intervalSeconds`

  **Default: `10`**

  The number of seconds to wait before each poll of the GitHub API for checks on this commit.

## Result

This action fails if any error occurred or timeout was reached.