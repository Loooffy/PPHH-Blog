# frozen_string_literal: true

module Api
  module V1
    class SeriesController < BaseController
      def index
        @series = Series.includes(:post_type).order(:series_name)
        @series = @series.joins(:post_type).where(post_types: { name: params[:type] }) if params[:type].present?
      end
    end
  end
end
