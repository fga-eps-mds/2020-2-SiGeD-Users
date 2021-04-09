const { Octokit } = require("@octokit/core")
const ghReleaseAssets = require('gh-release-assets')
const axios = require('axios')
const fs = require('fs')

const {TOKEN, URL, RELEASE_MINOR} = process.env;

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
  await axios.get(URL)
    .then((res) => {
      fs.writeFileSync('/tmp/sonar.json', JSON.stringify(res.data))
    })
}

const uploadSonarFile = async (upload_url) => {
  await saveSonarFile()
  ghReleaseAssets({
    url: upload_url,
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
  console.log(RELEASE_MINOR)
  const release = await createRelease()
  await uploadSonarFile(release)
}

script()


