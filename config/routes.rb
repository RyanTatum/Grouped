Rails.application.routes.draw do
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
  resources :features
  resources :sprints 
  resources :login
  resources :home
  resources :sessions
  resources :users
  resources :groups
  resources :poker
  resources :video
  resources :calendars
  match '/vote', to: 'poker#vote', via: :post
  match '/comment', to: 'poker#comment', via: :post
  match '/submitVote', to: 'poker#submitVote', via: :post
  match '/group_change', to: 'home#group_change', via: :post
  match '/group_change', to: 'home#group_change', via: :get
  match '/status', to: 'users#status', via: :post
  match '/status', to: 'users#status', via: :get
  match '/password_reset/', to: 'users#password', via: :post
  match '/chat', to: 'users#index', via: :get
  match '/mycalendar', to: 'calendars#edit', via: :get
  root 'users#new'
  resources :conversations do
    resources :messages
  end
end
