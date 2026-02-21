# frozen_string_literal: true

require "aws-sdk-s3"

class R2StorageService
  class UploadError < StandardError; end

  def initialize
    @access_key_id = ENV["R2_ACCESS_KEY_ID"]
    @secret_access_key = ENV["R2_SECRET_ACCESS_KEY"]
    @endpoint = ENV["R2_ENDPOINT"]
    @bucket = ENV["R2_BUCKET"]
  end

  def upload(file)
    validate_config!
    validate_file!(file)

    key = "#{SecureRandom.uuid}#{File.extname(file.original_filename)}"
    file.rewind

    client.put_object(
      bucket: @bucket,
      key: key,
      body: file,
      content_type: file.content_type
    )

    key
  end

  private

  def client
    @client ||= Aws::S3::Client.new(
      access_key_id: @access_key_id,
      secret_access_key: @secret_access_key,
      endpoint: @endpoint,
      region: "auto",
      force_path_style: true
    )
  end

  def validate_config!
    missing = []
    missing << "R2_ACCESS_KEY_ID" if @access_key_id.blank?
    missing << "R2_SECRET_ACCESS_KEY" if @secret_access_key.blank?
    missing << "R2_ENDPOINT" if @endpoint.blank?
    missing << "R2_BUCKET" if @bucket.blank?
    raise UploadError, "缺少 R2 設定: #{missing.join(', ')}" if missing.any?
  end

  def validate_file!(file)
    raise UploadError, "檔案不可為空" if file.blank?
    raise UploadError, "無效的檔案物件" unless file.respond_to?(:read) && file.respond_to?(:original_filename)
  end
end
