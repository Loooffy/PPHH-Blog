# frozen_string_literal: true

module Api
  module V1
    class PostsController < BaseController
      before_action :set_post, only: [:show, :update]

      def index
        @posts = Post.where(status: "published")
                    .where("published_at <= ?", Time.current)
                    .order(published_at: :desc)

        @posts = @posts.joins(:post_type).where(post_types: { name: params[:type] }) if params[:type].present?
        @posts = @posts.joins(:tags).where(tags: { id: params[:tag_id] }).distinct if params[:tag_id].present?

        @posts = @posts.includes(:tags, :series_posts => :series).page(params[:page]).per(params[:per_page] || 20)
      end

      def show
        if @post.blank? || @post.status != "published" ||
           @post.published_at.blank? || @post.published_at > Time.current
          return render json: { error: "Not found" }, status: :not_found
        end
      end

      def create
        @post = Post.new(post_params.except(:image_file))
        process_image_upload!(@post)
        if @post.save
          render :show, status: :created
        else
          render json: { errors: @post.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        return render json: { error: "Not found" }, status: :not_found if @post.blank?

        @post.assign_attributes(post_params.except(:image_file))
        process_image_upload!(@post)
        if @post.save
          render :show
        else
          render json: { errors: @post.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def set_post
        @post = Post.includes(:tags, :series_posts => :series).find_by(slug: params[:slug])
      end

      def post_params
        params.require(:post).permit(
          :user_id, :author_id, :director_id, :post_type_id,
          :title, :description, :content, :year, :rating, :status, :published_at,
          :image_file, tag_ids: [], series_posts_attributes: [:id, :series_id, :position, :_destroy]
        )
      end

      def process_image_upload!(post)
        image_file = params[:post]&.dig(:image_file)
        return if image_file.blank?

        key = R2StorageService.new.upload(image_file)
        post.image_key = key
      rescue R2StorageService::UploadError => e
        post.errors.add(:image_file, e.message)
      end
    end
  end
end
