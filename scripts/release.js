const { Octokit } = require("@octokit/core")
const ghReleaseAssets = require('gh-release-assets')
const axios = require('axios')
const fs = require('fs')

const TOKEN = ''

const octokit = new Octokit({ auth: TOKEN});
// const github = new GitHub(TOKEN);

const getLatestRelease = async () => {
  const releases = await octokit.request('GET /repos/{owner}/{repo}/releases', {
    owner: 'GabrielOak',
    repo: '2020-2-G4-Users'
  })
  return releases.data[0].tag_name  
}

const newTagName = async () => {
  let oldTag = await getLatestRelease()
  oldTag = oldTag.split('.')
  const tagNum = parseInt(oldTag[1]) + 1
  return oldTag[0] + '.' + tagNum
}

const createRelease = async () => {
  const tag = await newTagName()
  const res = await octokit.request('POST /repos/{owner}/{repo}/releases', {
    owner: 'GabrielOak',
    repo: '2020-2-G4-Users',
    tag_name: tag,
    name: tag
  })
  return res.data.upload_url
}

const saveSonarFile = async () => {
  const url = 'https://sonarcloud.io/api/measures/search_history?component=fga-eps-mds_2020-2-G4-Users&metrics=new_technical_debt,blocker_violations,bugs,classes,code_smells,cognitive_complexity,comment_lines,comment_lines_density,complexity_in_classes,complexity_in_functions,branch_coverage,new_branch_coverage,new_conditions_to_cover,confirmed_issues,coverage,new_coverage,complexity,development_cost,new_development_cost,duplicated_blocks,new_duplicated_blocks,duplicated_files,duplicated_lines,duplicated_lines_density,new_duplicated_lines_density,new_duplicated_lines,duplications_data,effort_to_reach_maintainability_rating_a,false_positive_issues,file_complexity_distribution,files,function_complexity_distribution,functions,generated_lines,generated_ncloc,info_violations,violations,line_coverage,new_line_coverage,ncloc,ncloc_language_distribution,lines_to_cover,new_lines_to_cover,sqale_rating,new_maintainability_rating,major_violations,minor_violations,new_blocker_violations,new_bugs,new_code_smells,new_critical_violations,new_info_violations,new_violations,new_lines,new_major_violations,new_minor_violations,new_security_hotspots,new_vulnerabilities,open_issues,quality_profiles,projects,public_api,public_documented_api_density,quality_gate_details,alert_status,reliability_rating,new_reliability_rating,reliability_remediation_effort,new_reliability_remediation_effort,reopened_issues,security_hotspots,security_hotspots_reviewed,new_security_hotspots_reviewed,security_rating,new_security_rating,security_remediation_effort,new_security_remediation_effort,security_review_rating,new_security_review_rating,security_hotspots_reviewed_status,new_security_hotspots_reviewed_status,security_hotspots_to_review_status,new_security_hotspots_to_review_status,skipped_tests,statements,sqale_index,sqale_debt_ratio,new_sqale_debt_ratio'
  await axios.get(url)
    .then((res) => {
      fs.writeFileSync('/tmp/sonar.json', JSON.stringify(res.data))
    })
}

const uploadSonarFile = async (url) => {
  await saveSonarFile()
  ghReleaseAssets({
    url: url,
    token: [TOKEN],
    assets: [
      '/tmp/sonar.json',
      {
        name: 'sonar.json',
        path: '/tmp/sonar.json'
      }
    ]
  })
}

const script = async () => {
  const release = await createRelease()
  await uploadSonarFile(release)
}

script()


