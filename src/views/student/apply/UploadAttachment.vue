<template>
    <el-card class="wrapper">
        <el-steps :active="active" finish-status="success">
            <el-step title="檢查申請表"></el-step>
            <el-step title="身份證明"></el-step>
            <el-step title="學測成績單"></el-step>
            <el-step title="教師推薦信"></el-step>
            <el-step title="考生照片"></el-step>
            <el-step title="其他材料"></el-step>
        </el-steps>
        <!--檢查申請表-->
        <div class="checkApplication" v-show="active===0">
            <p v-if="hasClosed" style="color: #F56C6C">已到截止日期！</p>
            <p v-else-if="!hasClosed&&hasFinishedUpload" style="color: #67C23A">您已完成附件上傳。</p>
            <div v-else-if="!hasClosed&&!hasFinishedUpload">
                <p>請檢查申請表是否填寫完整，確認後點擊進入下一步。</p>
                <p class="mark">注意：材料不符合要求將無法通過審核。</p>
            </div>
            <div class="footer">
                <el-button @click="$router.push('/student/application')" v-if="!hasFinishedUpload"
                           :disabled="hasClosed">返回檢查
                </el-button>
                <el-button type="primary" @click="++active" :disabled="hasClosed">
                    {{hasFinishedUpload?'重新上傳':'下一步'}}
                </el-button>
            </div>
        </div>
        <!--身份證明-->
        <div class="identity" v-show="active===1">
            <p>請在此上傳在台灣居住的有效身份證明和《台灣居民來往大陸通行證》。</p>
            <el-upload class="upload" drag :action="uploadServer" :file-list="identityList" :limit="2"
                       ref="identityUpload" :auto-upload="false" :headers="tokenHeader" :http-request="uploadIdentity"
                       :on-exceed="handleFileExceed" :on-success="handleUploadSuccess" :on-error="handleUploadError"
                       :before-upload="beforeFileUpload" :on-remove="handleIdentityRemove"
                       :on-change="handleIdentityChanges">
                <i class="el-icon-upload"></i>
                <div style="color: #909399">將文件拖到此處，或
                    <b style="color: #409EFF">點擊上傳</b>
                </div>
                <div slot="tip" style="color: #909399; font-size: 12px;">
                    只能上傳不超過<span class="mark">兩個PDF</span>文件，且大小不超過<span class="mark">10M</span>
                    {{hasFinishedUpload?'；':''}}
                    <span class="mark">{{hasFinishedUpload?'為確保準確，如需修改，請重新上傳':''}}</span>
                </div>
            </el-upload>
            <div class="footer">
                <el-button type="primary" @click="identityUpload">確認上傳</el-button>
                <el-button @click="--active">上一步</el-button>
                <el-button type="primary" @click="++active" :disabled="!canSkipIdentity">下一步</el-button>
            </div>
        </div>
        <!--學測成績單-->
        <div class="transcript" v-show="active===2">
            <p>請在此上傳2019年學測成績單。</p>
            <el-upload class="upload" drag :action="uploadServer" :file-list="transcriptList" :limit="1"
                       ref="transcriptUpload" :auto-upload="false" :headers="tokenHeader"
                       :http-request="uploadTranscript" :on-exceed="handleFileExceed" :on-success="handleUploadSuccess"
                       :before-upload="beforeFileUpload" :on-error="handleUploadError"
                       :on-remove="handleTranscriptRemove" :on-change="handleTranscriptChanges">
                <i class="el-icon-upload"></i>
                <div style="color: #909399">將文件拖到此處，或
                    <b style="color: #409EFF">點擊上傳</b>
                </div>
                <div slot="tip" style="color: #909399; font-size: 12px;">
                    只能上傳<span class="mark">一個PDF</span>文件，且大小不超過<span class="mark">10M</span>
                    {{hasFinishedUpload?'；':''}}
                    <span class="mark">{{hasFinishedUpload?'為確保準確，如需修改，請重新上傳':''}}</span>
                </div>
            </el-upload>
            <div class="footer">
                <el-button type="primary" @click="transcriptUpload">確認上傳</el-button>
                <el-button @click="--active">上一步</el-button>
                <el-button type="primary" @click="++active" :disabled="!canSkipTranscript">下一步</el-button>
            </div>
        </div>
        <!--教師推薦信-->
        <div class="recommend" v-show="active===3">
            <p>請在此上傳由兩位熟悉本人的中學資深教師出具的推薦信。</p>
            <el-upload class="upload" drag :action="uploadServer" :file-list="recommendList" :limit="2"
                       ref="recommendUpload" :auto-upload="false" :headers="tokenHeader" :http-request="uploadRecommend"
                       :on-exceed="handleFileExceed" :on-success="handleUploadSuccess"
                       :before-upload="beforeFileUpload" :on-error="handleUploadError"
                       :on-remove="handleRecommendRemove" :on-change="handleRecommendChanges">
                <i class="el-icon-upload"></i>
                <div style="color: #909399">將文件拖到此處，或
                    <b style="color: #409EFF">點擊上傳</b>
                </div>
                <div slot="tip" style="color: #909399; font-size: 12px;">
                    只能上傳不超過<span class="mark">兩個PDF</span>文件，且大小不超過<span class="mark">10M</span>
                    {{hasFinishedUpload?'；':''}}
                    <span class="mark">{{hasFinishedUpload?'為確保準確，如需修改，請重新上傳':''}}</span>
                </div>
            </el-upload>
            <div class="footer">
                <el-button type="primary" @click="recommendUpload">確認上傳</el-button>
                <el-button @click="--active">上一步</el-button>
                <el-button type="primary" @click="++active" :disabled="!canSkipRecommend">下一步</el-button>
            </div>
        </div>
        <!--考生照片-->
        <div class="photos" v-show="active===4">
            <p>請在此上傳考生本人的證件用標準照（正面免冠、白色背景、頭像輪廓清晰）。</p>
            <el-upload class="upload" drag :action="uploadServer" :file-list="photosList" :limit="2"
                       list-type="picture" ref="photosUpload" :auto-upload="false" :headers="tokenHeader"
                       :http-request="uploadPhotos" :on-exceed="handleFileExceed" :on-success="handleUploadSuccess"
                       :on-change="handlePhotosChanges" :before-upload="beforePhotosUpload"
                       :on-error="handleUploadError" :on-remove="handlePhotosRemove">
                <i class="el-icon-upload"></i>
                <div style="color: #909399">將文件拖到此處，或
                    <b style="color: #409EFF">點擊上傳</b>
                </div>
                <div slot="tip" style="color: #909399; font-size: 12px;">
                    只能上傳<span class="mark">一張照片（JPG/JPEG,PNG,BMP,GIF格式）</span>，且大小不超過<span class="mark">10M</span>
                    {{hasFinishedUpload?'；':''}}
                    <span class="mark">{{hasFinishedUpload?'為確保準確，如需修改，請重新上傳':''}}</span>
                </div>
            </el-upload>
            <div class="footer">
                <el-button type="primary" @click="photosUpload">確認上傳</el-button>
                <el-button @click="--active">上一步</el-button>
                <el-button type="primary" @click="++active" :disabled="!canSkipPhotos">下一步</el-button>
            </div>
        </div>
        <!--其他材料-->
        <div class="others" v-show="active===5">
            <p>請在此上傳其他相關材料。</p>
            <el-upload class="upload" drag :action="uploadServer" :file-list="othersList" :limit="3"
                       ref="othersUpload" :auto-upload="false" :headers="tokenHeader" :http-request="uploadOthers"
                       :on-exceed="handleFileExceed" :on-success="handleUploadSuccess" :on-change="handleOthersChanges"
                       :before-upload="beforeFileUpload" :on-error="handleUploadError" :on-remove="handleOthersRemove">
                <i class="el-icon-upload"></i>
                <div style="color: #909399">將文件拖到此處，或
                    <b style="color: #409EFF">點擊上傳</b>
                </div>
                <div slot="tip" style="color: #909399; font-size: 12px;">
                    只能上傳不超過<span class="mark">兩個PDF</span>文件，且大小不超過<span class="mark">10M</span>
                    {{hasFinishedUpload?'；':''}}
                    <span class="mark">{{hasFinishedUpload?'為確保準確，如需修改，請重新上傳':''}}</span>
                </div>
            </el-upload>
            <div class="footer">
                <el-button type="primary" @click="othersUpload">確認上傳</el-button>
                <el-button @click="--active">上一步</el-button>
                <el-button type="primary" @click="finishUpload" :disabled="!canSkipOthers">完成</el-button>
            </div>
        </div>
    </el-card>
</template>

<script lang="ts">
  import { Vue, Component, Watch } from 'vue-property-decorator'
  import { getStudentToken } from 'utils/token.ts'
  import { checkAttachmentUpload, getDDL, sendAttachment } from 'utils/api'
  import { isArray } from 'utils/common'

  @Component({})
  export default class UploadAttachment extends Vue {
    active: number = 0
    hasFinishedUpload: boolean = false
    hasClosed: boolean = false

    uploadServer: string = 'http://localhost:3141/application/attachment'

    identityList: any = []
    identityNames: any = []
    identityFileData: any = new FormData()
    hasFinishedIdentity: boolean = false

    transcriptList: any = []
    transcriptNames: any = []
    transcriptFileData: any = new FormData()
    hasFinishedTranscript: boolean = false

    recommendList: any = []
    recommendNames: any = []
    recommendFileData: any = new FormData()
    hasFinishedRecommend: boolean = false

    photosList: any = []
    photosNames: any = []
    photosFileData: any = new FormData()
    hasFinishedPhotos: boolean = false

    othersList: any = []
    othersNames: any = []
    othersFileData: any = new FormData()
    hasFinishedOthers: boolean = false

    mounted () {
      // 获取附件上传状态
      this.$nextTick(() => {
        // this.hasClosed = true
        getDDL()
          .then(res => {
            if (res.data.ddl) {
              this.hasClosed = new Date() >= new Date(res.data.ddl)
            }
          })
          .catch(err => {
            this.hasClosed = false
            this.$message({
              message: err.toString(),
              type: 'error'
            })
          })
        checkAttachmentUpload({
          types: ['身份证明', '学测成绩单', '推荐信', '考生照片', '其他材料']
        }).then((res) => {
          this.hasFinishedUpload = res.data.hasUploaded
          if (this.hasFinishedUpload) {
            this.hasFinishedIdentity = true
            this.hasFinishedTranscript = true
            this.hasFinishedRecommend = true
            this.hasFinishedOthers = true
            this.hasFinishedPhotos = true
          }
        }).catch((err) => {
          this.hasFinishedUpload = false
        })
      })
    }

    get tokenHeader () {
      let token = getStudentToken()
      return {
        Authorization: `Bearer ${token}`
      }
    }

    get canSkipIdentity () {
      return this.hasFinishedUpload || (this.identityNames.length > 0 && this.hasFinishedIdentity)
    }

    get canSkipTranscript () {
      return this.hasFinishedUpload || (this.transcriptNames.length > 0 && this.hasFinishedTranscript)
    }

    get canSkipRecommend () {
      return this.hasFinishedUpload || (this.recommendNames.length > 0 && this.hasFinishedRecommend)
    }

    get canSkipOthers () {
      return this.hasFinishedUpload || (this.othersNames.length > 0 && this.hasFinishedOthers)
    }

    get canSkipPhotos () {
      return this.hasFinishedUpload || (this.photosNames.length > 0 && this.hasFinishedPhotos)
    }

    checkDDL () {
      let status: boolean = false
      getDDL()
        .then(res => {
          if (res.data.ddl) {
            status = new Date() >= new Date(res.data.ddl)
          }
        })
        .catch(err => {
          this.$message({
            message: err.toString(),
            type: 'error'
          })
        })
      return status
    }

    // 身份證明
    identityUpload () {
      let upload: any = this.$refs.identityUpload
      upload.submit()
      let header: any = {
        headers: { "Content-Type": "multipart/form-data" }
      }
      if (this.identityFileData.getAll('file').length === 0) {
        this.$message.error('請按照要求上傳附件')
      } else {
        if (this.checkDDL()) {
          this.$message.error('提交已經截止')
        } else {
          this.identityFileData.append('type', '身份证明')
          this.identityFileData.getAll('file').forEach(file => {
            if (this.identityNames.indexOf(file.name) < 0) {
              this.identityNames.push(file.name)
            }
          })
          sendAttachment(this.identityFileData, header)
            .then(res => {
              if (res.data.succeed) {
                this.$message.success("上傳成功")
                this.hasFinishedIdentity = true
              } else {
                this.$message.error(res.data.msg)
              }
            })
            .catch(err => {
              this.$message.error(err.toString())
            })
        }
      }
    }

    uploadIdentity (file) {
      this.identityFileData.append('file', file.file)
    }

    handleIdentityRemove (file, fileList) {
      let uploads = this.identityFileData.getAll('file')
      if (isArray(uploads)) { // 不止一個文件
        uploads = uploads.filter(upload => {
          return upload.uid !== file.uid
        })
        this.identityFileData.delete('file')
        this.identityNames = []
        uploads.forEach(upload => {
          this.identityFileData.append('file', upload)
          this.identityNames.push(upload.name)
        })
      } else {
        this.identityFileData.delete('file')
      }
    }

    handleIdentityChanges (file, fileList) {
      let names = []
      fileList.forEach(file => {
        names.push(file.name)
      })
      let index = names.indexOf(file.name)
      if (index !== fileList.length - 1) {
        this.identityList = fileList.slice(-1)
      }
    }

    // 學測成績單
    transcriptUpload () {
      let upload: any = this.$refs.transcriptUpload
      upload.submit()
      let header: any = {
        headers: { "Content-Type": "multipart/form-data" }
      }
      if (this.transcriptFileData.getAll('file').length === 0) {
        this.$message.error('請按照要求上傳附件')
      } else {
        if (this.checkDDL()) {
          this.$message.error('提交已經截止')
        } else {
          this.transcriptFileData.append('type', '学测成绩单')
          this.transcriptFileData.getAll('file').forEach(file => {
            if (this.transcriptNames.indexOf(file.name) < 0) {
              this.transcriptNames.push(file.name)
            }
          })
          sendAttachment(this.transcriptFileData, header)
            .then(res => {
              if (res.data.succeed) {
                this.$message.success("上傳成功")
                this.hasFinishedTranscript = true
              } else {
                this.$message.error(res.data.msg)
              }
            })
            .catch(err => {
              this.$message.error(err.toString())
            })
        }
      }
    }

    uploadTranscript (file) {
      this.transcriptFileData.append('file', file.file)
    }

    handleTranscriptRemove (file, fileList) {
      let uploads = this.transcriptFileData.getAll('file')
      if (isArray(uploads)) { // 不止一個文件
        uploads = uploads.filter(upload => {
          return upload.uid !== file.uid
        })
        this.transcriptFileData.delete('file')
        this.transcriptNames = []
        uploads.forEach(upload => {
          this.transcriptFileData.append('file', upload)
          this.transcriptNames.push(upload.name)
        })
      } else {
        this.transcriptFileData.delete('file')
      }
    }

    handleTranscriptChanges (file, fileList) {
      let names = []
      fileList.forEach(file => {
        names.push(file.name)
      })
      let index = names.indexOf(file.name)
      if (index !== fileList.length - 1) {
        this.transcriptList = fileList.slice(-1)
      }
    }

    // 推薦信
    recommendUpload () {
      let upload: any = this.$refs.recommendUpload
      upload.submit()
      let header: any = {
        headers: { "Content-Type": "multipart/form-data" }
      }
      if (this.recommendFileData.getAll('file').length === 0) {
        this.$message.error('請按照要求上傳附件')
      } else {
        if (this.checkDDL()) {
          this.$message.error('提交已經截止')
        } else {
          this.recommendFileData.append('type', '推荐信')
          this.recommendFileData.getAll('file').forEach(file => {
            if (this.recommendNames.indexOf(file.name) < 0) {
              this.recommendNames.push(file.name)
            }
          })
          sendAttachment(this.recommendFileData, header)
            .then(res => {
              if (res.data.succeed) {
                this.$message.success("上傳成功")
                this.hasFinishedRecommend = true
              } else {
                this.$message.error(res.data.msg)
              }
            })
            .catch(err => {
              this.$message.error(err.toString())
            })
        }
      }
    }

    uploadRecommend (file) {
      this.recommendFileData.append('file', file.file)
    }

    handleRecommendRemove (file, fileList) {
      let uploads = this.recommendFileData.getAll('file')
      if (isArray(uploads)) { // 不止一個文件
        uploads = uploads.filter(upload => {
          return upload.uid !== file.uid
        })
        this.recommendFileData.delete('file')
        this.recommendNames = []
        uploads.forEach(upload => {
          this.recommendFileData.append('file', upload)
          this.recommendNames.push(upload.name)
        })
      } else {
        this.recommendFileData.delete('file')
      }
    }

    handleRecommendChanges (file, fileList) {
      let names = []
      fileList.forEach(file => {
        names.push(file.name)
      })
      let index = names.indexOf(file.name)
      if (index !== fileList.length - 1) {
        this.recommendList = fileList.slice(-1)
      }
    }

    // 照片
    photosUpload () {
      let upload: any = this.$refs.photosUpload
      upload.submit()
      let header: any = {
        headers: { "Content-Type": "multipart/form-data" }
      }
      if (this.photosFileData.getAll('file').length === 0) {
        this.$message.error('請按照要求上傳照片')
      } else {
        if (this.checkDDL()) {
          this.$message.error('提交已經截止')
        } else {
          this.photosFileData.append('type', '考生照片')
          this.photosFileData.getAll('file').forEach(file => {
            if (this.photosNames.indexOf(file.name) < 0) {
              this.photosNames.push(file.name)
            }
          })
          sendAttachment(this.photosFileData, header)
            .then(res => {
              if (res.data.succeed) {
                this.$message.success("上傳成功")
                this.hasFinishedPhotos = true
              } else {
                this.$message.error(res.data.msg)
              }
            })
            .catch(err => {
              this.$message.error(err.toString())
            })
        }
      }
    }

    uploadPhotos (file) {
      this.photosFileData.append('file', file.file)
    }

    handlePhotosRemove (file, fileList) {
      let uploads = this.photosFileData.getAll('file')
      if (isArray(uploads)) { // 不止一個文件
        uploads = uploads.filter(upload => {
          return upload.uid !== file.uid
        })
        this.photosFileData.delete('file')
        this.photosNames = []
        uploads.forEach(upload => {
          this.photosFileData.append('file', upload)
          this.photosNames.push(upload.name)
        })
      } else {
        this.photosFileData.delete('file')
      }
    }

    handlePhotosChanges (file, fileList) {
      let names = []
      fileList.forEach(file => {
        names.push(file.name)
      })
      let index = names.indexOf(file.name)
      if (index !== fileList.length - 1) {
        this.photosList = fileList.slice(-1)
      }
    }

    beforePhotosUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isBMP = file.type === 'image/bmp'
      const isGIF = file.type === 'image/gif'
      const isPNG = file.type === 'image/png'
      const underLimit = file.size / 1024 / 1024 <= 10
      return (isJPG || isBMP || isGIF || isPNG) && underLimit
    }

    // 其他材料
    othersUpload () {
      let upload: any = this.$refs.othersUpload
      upload.submit()
      let header: any = {
        headers: { "Content-Type": "multipart/form-data" }
      }
      if (this.othersFileData.getAll('file').length === 0) {
        this.$message.error('請按照要求上傳附件')
      } else {
        if (this.checkDDL()) {
          this.$message.error('提交已經截止')
        } else {
          this.othersFileData.append('type', '其他材料')
          this.othersFileData.getAll('file').forEach(file => {
            if (this.othersNames.indexOf(file.name) < 0) {
              this.othersNames.push(file.name)
            }
          })
          sendAttachment(this.othersFileData, header)
            .then(res => {
              if (res.data.succeed) {
                this.$message.success("上傳成功")
                this.hasFinishedOthers = true
              } else {
                this.$message.error(res.data.msg)
              }
            })
            .catch(err => {
              this.$message.error(err.toString())
            })
        }
      }
    }

    uploadOthers (file) {
      this.othersFileData.append('file', file.file)
    }

    handleOthersRemove (file, fileList) {
      let uploads = this.othersFileData.getAll('file')
      if (isArray(uploads)) { // 不止一個文件
        uploads = uploads.filter(upload => {
          return upload.uid !== file.uid
        })
        this.othersFileData.delete('file')
        this.othersNames = []
        uploads.forEach(upload => {
          this.othersFileData.append('file', upload)
          this.othersNames.push(upload.name)
        })
      } else {
        this.othersFileData.delete('file')
      }
    }

    handleOthersChanges (file, fileList) {
      let names = []
      fileList.forEach(file => {
        names.push(file.name)
      })
      let index = names.indexOf(file.name)
      if (index !== fileList.length - 1) {
        this.othersList = fileList.slice(-1)
      }
    }

    beforeFileUpload (file) {
      const isPDF = file.type === 'application/pdf'
      const underLimit = file.size / 1024 / 1024 <= 10
      return isPDF && underLimit
    }

    handleFileExceed () {
      this.$message.warning('文件數量超過限制')
    }

    handleUploadSuccess (response) {
      if (response.succeed) {
        this.$message.success('上傳成功')
      } else {
        this.$message.error('上傳失敗')
      }
    }

    handleUploadError (err) {
      this.$message.error(err.toString())
    }

    finishUpload () {
      this.$message.success('附件上傳完成')
      this.hasFinishedUpload = true
      this.active = 0
      this.identityList = []
      this.identityFileData = new FormData()
      this.transcriptList = []
      this.transcriptFileData = new FormData()
      this.recommendList = []
      this.recommendFileData = new FormData()
      this.othersList = []
      this.othersFileData = new FormData()
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
    .wrapper {
        margin: 30px 80px;
        width: 1000px;

        .checkApplication {
            margin-top: 30px;
        }

        .identity {
            margin-top: 30px;
        }

        .transcript {
            margin-top: 30px;
        }

        .footer {
            float: right;
            margin-top: 20px;
            margin-bottom: 20px;
        }

        .mark {
            font-weight: bold;
            color: #F56C6C;
        }
    }
</style>
