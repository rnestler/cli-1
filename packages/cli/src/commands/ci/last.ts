import {Command, flags} from '@heroku-cli/command'
import * as Heroku from '@heroku-cli/schema'
import {ux} from '@oclif/core'

import {getPipeline} from '../../lib/ci/pipelines'
import {displayTestRunInfo} from '../../lib/ci/test-run'

export default class CiLast extends Command {
  static description = 'looks for the most recent run and returns the output of that run'

  static examples = [
    `$ heroku ci:last --pipeline=my-pipeline --node 100
`,
  ]

  static flags = {
    app: flags.string({char: 'a', description: 'app name'}),
    remote: flags.remote(),
    node: flags.string({description: 'the node number to show its setup and output', required: false}),
    pipeline: flags.pipeline({required: false}),
  }

  async run() {
    const {flags} = await this.parse(CiLast)
    const pipeline = await getPipeline(flags, this.heroku)
    const headers = {Range: 'number ..; order=desc,max=1'}
    const {body: latestTestRuns} = await this.heroku.get<Heroku.TestRun[]>(`/pipelines/${pipeline.id}/test-runs`, {headers})

    if (latestTestRuns.length === 0) {
      return ux.warn('No Heroku CI runs found for the specified app and/or pipeline.')
    }

    const {body: testRun} = await this.heroku.get<Heroku.TestRun>(`/pipelines/${pipeline.id}/test-runs/${latestTestRuns[0].number}`)
    const {body: testNodes} = await this.heroku.get<Heroku.TestNode[]>(`/test-runs/${testRun.id}/test-nodes`)

    await displayTestRunInfo(this, testRun, testNodes, flags.node)
  }
}
