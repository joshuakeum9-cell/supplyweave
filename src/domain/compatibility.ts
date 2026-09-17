import type {
  CompatibilityAssessment,
  CompatibilityRequirements,
  ProductSpec,
} from './types'

/**
 * Compatibility is supplier approved demo data. SupplyWeave does not
 * independently certify that two products can share a production run. This
 * function only replays the supplier's own rules against a requirement.
 *
 * Full: every relevant attribute matches, so the whole run is shared.
 * Partial: the board and forming steps are shared but a later step, printing or
 *   finishing, stays separate and needs supplier confirmation.
 * False: the products look similar but need different board, tooling or
 *   certification, so nothing is shared.
 */
export function assess(
  product: ProductSpec,
  requirements: CompatibilityRequirements,
): CompatibilityAssessment {
  const blocking: string[] = []

  if (product.boardGrade !== requirements.boardGrade) {
    blocking.push(
      `Board grade differs: the run is set up for ${requirements.boardGrade}, this requirement asks for ${product.boardGrade}.`,
    )
  }
  if (product.wall !== requirements.wall) {
    blocking.push(
      `Wall construction differs: ${requirements.wall} wall on the run, ${product.wall} wall requested. Different corrugator setup.`,
    )
  }
  if (product.flute !== requirements.flute) {
    blocking.push(
      `Flute profile differs: ${requirements.flute} on the run, ${product.flute} requested.`,
    )
  }
  if (product.style !== requirements.style || product.dimensionsIn !== requirements.dimensionsIn) {
    blocking.push(
      `Die and dimensions differ: the run cuts ${requirements.style} ${requirements.dimensionsIn}.`,
    )
  }

  const missingCerts = requirements.certifications.filter(
    (cert) => !product.certifications.includes(cert),
  )
  if (missingCerts.length > 0) {
    blocking.push(`Certification required by the run and not held: ${missingCerts.join(', ')}.`)
  }

  if (blocking.length > 0) {
    return {
      state: 'false',
      sharedSteps: [],
      separateSteps: ['Every production step'],
      reasons: blocking,
      source: 'supplier_approved_demo_data',
    }
  }

  const separateSteps: string[] = []
  const laterStepReasons: string[] = []

  if (product.print !== requirements.print) {
    separateSteps.push('Printing')
    laterStepReasons.push(
      `Print differs: the run is ${requirements.print === 'none' ? 'unprinted' : requirements.print}, this requirement asks for ${product.print === 'none' ? 'no print' : product.print}. A separate print pass and plate setup is needed.`,
    )
  }
  if (product.finishing !== requirements.finishing) {
    separateSteps.push('Finishing')
    laterStepReasons.push(
      `Finishing differs: ${requirements.finishing} on the run, ${product.finishing} requested. Separate finishing and handling.`,
    )
  }

  if (separateSteps.length > 0) {
    return {
      state: 'partial',
      sharedSteps: ['Board and corrugation', 'Die cutting'],
      separateSteps,
      reasons: laterStepReasons,
      source: 'supplier_approved_demo_data',
    }
  }

  return {
    state: 'full',
    sharedSteps: [
      'Board and corrugation',
      'Die cutting',
      'Printing',
      'Finishing',
      'Quality checks',
    ],
    separateSteps: [],
    reasons: [
      `Same board grade (${requirements.boardGrade}), flute (${requirements.flute}) and wall.`,
      `Same die: ${requirements.style} ${requirements.dimensionsIn}.`,
      'Same print and finishing, so no extra setup between the two orders.',
      'Destination is inside the facility service region.',
    ],
    source: 'supplier_approved_demo_data',
  }
}
